FROM ubuntu:18.04
RUN apt-get update -y
RUN apt update -y
RUN apt install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa 
RUN apt install -y python3.7
RUN apt install -y python3.7-venv
RUN apt-get install -y python3-pip 
RUN apt-get install -y git 
RUN python3.7 -m pip install --upgrade pip

RUN useradd -m atk && echo "atk:atk" | chpasswd && adduser atk sudo
USER atk

WORKDIR /home/atk
ENTRYPOINT ["/bin/sh", "-c", "/bin/bash"]

ENV VIRTUAL_ENV=.env
RUN python3.7 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
