# Build Command

docker build -t user-manager:latest .

# Run Command

docker run -d --rm --name myapp -p 8080:3000 user-manager:latest

# Website

http://localhost:8080/users/create

# Deploying The Stack

docker stack deploy -c docker-compose.yaml myapp-stack

# Scaling Out

docker service scale myapp-stack_my1stwebsite=7

# Removing The Stack

docker stack rm myapp-stack
