/*
  A tour of the HCL syntax: blocks, arguments, every type of value,
  references between resources, string templates and heredocs.
*/

# A random name for an imaginary server.
resource "random_pet" "server" {
  length = 2 // two words, joined by "-"
}

# An object kept in the state, holding one value of each kind.
resource "terraform_data" "inventory" {
  input = {
    name    = random_pet.server.id         # string, known after apply
    cpus    = 2                            # number
    public  = false                        # bool
    ports   = [80, 443]                    # tuple, converted as needed
    aliases = toset(["web", "www", "web"]) # set: duplicates disappear
    tags = {                               # object
      course  = "opentofu"
      chapter = "04"
    }
  }
}

# A text file rendered from a heredoc with template directives.
# The heredoc is not indented: see the chapter for why.
resource "local_file" "motd" {
  filename        = "${path.module}/out/motd.txt"
  file_permission = "0644"
  content         = <<EOT
Server ${terraform_data.inventory.output.name} (${terraform_data.inventory.output.cpus} CPUs)
%{for port in terraform_data.inventory.output.ports~}
- listens on port ${port}
%{endfor~}
Visibility: %{if terraform_data.inventory.output.public}public%{else}private%{endif}
EOT
}
