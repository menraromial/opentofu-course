# Declarative version: the desired result, described once.
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 4.6"
    }
  }
}

provider "docker" {}

resource "docker_network" "ch01" {
  name = "ch01-net"
}

resource "docker_image" "nginx" {
  name         = "nginx:1.29-alpine"
  keep_locally = true # destroy leaves the image in the local cache
}

resource "docker_container" "web" {
  name  = "ch01-web"
  image = docker_image.nginx.image_id

  networks_advanced {
    name = docker_network.ch01.name
  }

  ports {
    internal = 80
    external = 8081
  }
}
