import bcrypt

password = input("Choisis le mot de passe admin : ")
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
print("\nColle ceci dans ton .env :")
print(hashed.decode())