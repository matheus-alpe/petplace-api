# PetPlace API

## Backend of a system for donation and adoption of pets

## Status of the Project: In developing

### Routes

###### Session
- `/login`  -- faz a autenticação do usuário através de 'email' e 'password' passados como parâmetro
######

- `/load-session` -- verifica se o token de sessão passado como parâmetro é valido e então verifica se o user passado como parâmetro é valido

###### Users

- `/register-user` -- faz a inserção de um user body passado como parâmetro, sem o id que é criado automaticamente
######

- `/update-user` -- verifica se o token de sessão passado como parâmetro é válido e então faz o update dos dados do user que foi passado como parâmetro, usando sua id
######

- `/delete-user` -- verifica se o token de sessão passado como parâmetro é válido e então faz a exclusão do user, passado como parâmetro, do database através da id do user ... exclui quaisquer pets desse user

###### Pets

- `/register-pet` -- verifica se o token de sessão passado como parâmetro é válido e então faz a inserção de um pet body passado como parâmetro, sem o id que é criado automaticamente, cnpj ou cpf são necessários
######

- `/update-pet` -- verifica se o token de sessão passado como parâmetro é válido e então faz o update dos dados de um pet que foi passado como parâmetro, através de sua id
######

- `/delete-pet` -- verifica se o token de sessão passado como parâmetro é válido e então faz a exclusão de um pet passado como parâmetro, através de sua id
######

- `/show-user-pets` -- verifica se o token de sessão passado como parâmetro é válido e então retorna todos os pets do user com a id passada como parâmetro
######

- `/search-pet-by`-- verifica se o token de sessão passado como parâmetro é válido e então mostra os pets de acordo com property e value passados como parâmetro, sendo que property = alguma coluna da tabela de pets e value = um dos valores possiveis para tal coluna
######

- `/search-pet-info` -- verifica se o token de sessão passado como parâmetro é válido e então mostra a property passada como parâmetro do pet de id passada por parâmetro, sendo que property = alguma coluna da tabela de pets

###### Donation Process

- `/create-term` -- verifica se o token de sessão passado como parâmetro é válido e então faz a inserção de um responsibilityTerm body, id não é necessário, cpf do doador e do adotador, assim como id do pet são necessários
######

- `/change-owners` -- verifica se o token de sessão passado como parâmetro é válido e então faz a troca do dono de um pet, cpf do doador e do adotador são necessários, assim como id do pet

###### Veterinary History

- `/create-vetHistory` -- verifica se o token de sessão passado como parâmetro é válido e então faz a inserção de um vetHistory body, id não é necessário, descricao e pet id são necessários
######

- `/update-vetHistory` -- verifica se o token de sessão passado como parâmetro é válido e então faz o update dos dados de um vetHistory passado como parâmetro
######

- `/delete-vetHistory` -- verifica se o token de sessão passado como parâmetro é válido e então faz a exclusão de um vetHistory, através do id de vetHistory passado como parâmetro
######

- `/show-pet-vetHistory` -- verifica se o token de sessão passado como parâmetro é válido e então mostra todo histórico veterinário de um pet através de uma pet id passada como parâmetro
