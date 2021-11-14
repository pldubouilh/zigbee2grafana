build:
	sudo docker build -t home .

interactive: build
	sudo docker run \
		-it \
		-v ${PWD}/data:/app/data \
		--device=/dev/ttyACM0 \
		-e TZ=Europe/Berlin \
		-v /run/udev:/run/udev:ro \
		--privileged=true \
		--entrypoint=/bin/sh \
		home

run: build
	sudo docker run \
		-it \
		-v ${PWD}/data:/app/data \
		--device=/dev/ttyACM0 \
		-e TZ=Europe/Amsterdam \
		-v /run/udev:/run/udev:ro \
		--privileged=true \
		home

