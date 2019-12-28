# Export env

.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
.DEFAULT_GOAL := help
	
build_client:
	@yarn build;\
	heroku container:push web --app lapi-go-admin;\
	heroku container:release web --app lapi-go-admin;

export_heroku_env: #export env
	@export ENV_FILE="$$PWD/.env";echo $$ENV_FILE;\
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
	read -p "Build app (y/n), enter to skip " answer2;\
	answer2=$${answer2:-n};\
	if [ $$answer2 != "$${answer2#[Yy]}" ] ;then\
		make build_client;\
	fi;\
	git add . && git commit -m "$$commit";\
	git push origin master;\
	git push heroku master;\
	heroku open;\
	echo "========== DONE =========="
	
