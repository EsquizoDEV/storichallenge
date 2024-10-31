FROM node:18


# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install
RUN npm install -g typescript

# Bundle app source
COPY . .

# Expose port 9999
EXPOSE 9999

# Build the app
# Start the app
CMD ["npm", "start"]