# Export env
ROOT_DIR=$(PWD)
DOCKER_DIR=$(ROOT_DIR)/docker/dev
DOCKER_COMPOSE_FILE=$(DOCKER_DIR)/docker-compose.yml
cnf ?= $(DOCKER_DIR)/.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
.DEFAULT_GOAL := help

# Docs
doc: ## Generate docs
	swag init

dev: ##
	CompileDaemon -build="go build -o main $(ROOT_DIR)"  -command="$(ROOT_DIR)/main serve" -directory="$(ROOT_DIR)" -pattern=".go"
# Build the container
version: ## Get current version
	@echo "Current versionn ${APP_NAME}:${VERSION}"

## Serve dev development
up: verify
	docker-compose -f $(DOCKER_COMPOSE_FILE) up

verify: ## Verify docker-compose
	docker-compose -f $(DOCKER_COMPOSE_FILE) config

down: ## Down a container and remove volumes
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v

backup:
	@dir=$$PWD/backups;\
	echo "Backup dirctory: $$dir";\
	echo "Current time: $$(date "+%Y.%m.%d-%H.%M.%S")";\
	mkdir -p "$$dir";\
	pg_dump --file "$$PWD/backups/$$(date "+%Y.%m.%d-%H.%M.%S")" --host $(DB_HOST) --port $(DB_PORT) --username $(DB_USER)  --verbose --format=c --blobs $(DB_NAME);
	
build_client:
	@cd client && git pull origin master && yarn && yarn build && cd .. && rm -rf ./public/* && cp -rf client/dist/* ./public

export_heroku_env: #export env
	@export ENV_FILE="$$PWD/docker/heroku/.env";echo $$ENV_FILE;\
	export vars="";\
	while IFS= read -r line; do\
        if [[ -z $$line ]] ; then\
			continue;\
		fi;\
		if [ $${line:0:1} == "#" ]; then\
			continue;\
		fi;\
		while IFS='=' read key value; do\
			k=$$(heroku config:get -a lapi-go $$key);\
			if [[ -z $$k ]]; then\
				vars+=" $$line";\
			else\
				if [ $$k != $$value ]; then\
				vars+=" $$line";\
				else\
					echo "Skip same $$key=$$value";\
				fi;\
			fi;\
			echo "vars $$vars";\
		done <<<$$line;\
    done < $$ENV_FILE;\
	if [ vars != "" ]; then\
		echo "asdfasdfasd";\
		heroku config:set -a lapi-go $$vars;\
	fi;

heroku:
	@read -p "Enter commit: " commit; \
	commit=$${commit:-"Default commit"};\
	read -p "Update heroku env vars (y/n), enter to skip " answer;\
	answer=$${answer:-n};\
	if [ $$answer != "$${answer#[Yy]}" ] ;then\
		make export_heroku_env;\
	fi;\
	read -p "Build client (y/n), enter to skip " answer2;\
	answer2=$${answer2:-n};\
	if [ $$answer2 != "$${answer2#[Yy]}" ] ;then\
		make build_client;\
	fi;\
	rm -f cp_main;\
	while read -r line; do \
		if [ "$$line" = "// @host localhost:8080" ]; then \
			echo '//// @host localhost:8080' >> cp_main;\
			continue;\
		fi;\
		if [ "$$line" = "// @schemes http https" ]; then \
			echo '//// @schemes http https' >> cp_main;\
			continue;\
		fi;\
		echo $$line >> cp_main;\
    done < main.go ;\
	mv -f main.go temp_main ;\
	mv -f cp_main main.go ;\
	make doc ;\
	mv -f temp_main main.go ;\
	git add . ;\
	git commit -m "$$commit";\
	git push -u origin master;\
	git push -f heroku master;\
	make doc
	
build-no-cache: ## Build the container without caching
	docker build --no-cache -t $(APP_NAME):$(VERSION) .

adb: ## Attach to postgres:alpine
	docker exec -it $(APP_NAME)-postgres psql -h $(DB_HOST) -U $(DB_USER) -d $(DB_NAME)

aa: ## Attach to app container
	docker exec -it $(APP_NAME)-app /bin/sh

run: ## Run container on port configured in `.env`
	docker run -i -t --rm --env-file=./.dev.env -p=$(PORT):$(PORT) --name="$(APP_NAME)" $(APP_NAME)

stop: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)

release: ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to ECR
	build-no-cache publish

# Docker publish
publish: repo-login publish-latest publish-version ## Publish the `{version}` ans `latest` tagged containers to ECR

publish-latest: tag-latest ## Publish the `latest` taged container to ECR
	@echo 'publish latest to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):latest

publish-version: tag-version ## Publish the `{version}` taged container to ECR
	@echo 'publish $(VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(APP_NAME):$(VERSION)


# Docker tagging
tag: ## Generate container tags for the `{version}` ans `latest` tags
	tag-latest tag-version

tag-latest: ## Generate container `{version}` tag
	@echo 'create tag latest'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):latest

tag-version: ## Generate container `latest` tag
	@echo 'create tag $(VERSION)'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):$(VERSION)
