# PetPlace API

## Backend of a system for donation and adoption of pets

## Status of the Project: In developing

### Routes

- `/login`  -- faz a autenticação do usuário através de 'email' e 'password' passados como parâmetro

- `/load-session` -- verifica se o token de sessão passado como parâmetro é valido e então verifica se o user passado como parâmetro é valido

- `/register-user` -- faz a inserção de um user body passado como parâmetro, sem o id que é criado automaticamente

- `/update-user` -- verifica se o token de sessão passado como parâmetro é válido e então faz o update dos dados do user que foi passado como parâmetro, usando sua id

- `/delete-user` -- verifica se o token de sessão passado como parâmetro é válido e então faz a exclusão do user, passado como parâmetro, do database através da id do user ... exclui quaisquer pets desse user

- `/register-pet` -- faz a inserção de um pet body passado como parâmetro, sem o id que é criado automaticamente, cnpj ou cpf são necessários

- `/update-pet` -- faz o update dos dados de um pet que foi passado como parâmetro, através de sua id

- `/delete-pet` -- faz a exclusão de um pet passado como parâmetro, através de sua id