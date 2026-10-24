# A random two-word name, generated once and kept in the state.
resource "random_pet" "name" {
  length = 2
}

# A file on the local disk whose content uses the generated name.
resource "local_file" "greeting" {
  filename = "${path.module}/out/greeting.txt"
  content  = "Hello from ${random_pet.name.id}\n"

  file_permission = "0644"
}
