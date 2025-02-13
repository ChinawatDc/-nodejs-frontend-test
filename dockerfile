# Stage 1: Builder Stage (for building the app)
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./ 
COPY package-lock.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application (for production)
RUN npm run build

# Stage 2: Production Stage (for running the app)
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Install production dependencies only
COPY package.json ./
COPY package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy the build and .next directory from the builder stage
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

# Expose the port that the app will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "run", "start"]