# jobumes-server

This is the backend server for the Red Gummi service

## Getting Started
Install the module with: `npm install jobumes-server`

## Deployment Instructions for local stage - (your laptop)
### 1. Install VirtualBox
Download VirtualBox from https://www.virtualbox.org/wiki/Downloads
If your OS is Ubuntu, then you may download from here: https://www.virtualbox.org/wiki/Linux_Downloads
Once the .deb file is downloaded it can be installed with the dpkg command.
The below commands show how to install VirtualBox on Ubuntu 16.04

$ wget http://download.virtualbox.org/virtualbox/5.1.18/virtualbox-5.1_5.1.18-114002~Ubuntu~xenial_amd64.deb
$ sudo dpkg -i virtualbox-5.1_5.1.18-114002~Ubuntu~xenial_amd64.deb

### 2. Install Vagrant
Download Vagrant from https://www.vagrantup.com/downloads.html
If your OS is Ubuntu, then you may download the one for Debian OS.
Once the .deb file is downloaded it can be installed with the dpkg command

$ sudo dpkg -i vagrant_1.9.3_x86_64.deb

### 4. Bring up the VM
In a terminal, go into the project home folder and use Vagrant to bring up the VM

$ vagrant up --provider=virtualbox

This will take some time to setup the VM in your laptop

### 5. SSH into the VM
Once setup is complete you can use Vagrant to SSH into the VM, like below.

$ vagrant ssh


## Deployment Instructions for production stage - (AWS)
To deploy to AWS EC2 instance, we will use the vagrant-aws plugin. Install it like so:

$ vagrant plugin install vagrant-aws

## License
Licensed under the private license.
  
