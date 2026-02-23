# 🍅 Pomodoro Timer – Production-Ready Web Application

A modern Pomodoro Timer built with a Vite-based frontend stack, containerized using Docker, served via Nginx, and deployed on AWS EC2.

This project demonstrates frontend development, production optimization, containerization, and cloud deployment using real-world engineering practices.

---

## 🚀 Live Application

🔗 http://65.2.124.193:8080/


---

## 📌 Project Overview

The Pomodoro Technique is a time-management method that alternates focused work sessions with structured breaks.

This application allows users to:

- Start, pause, and resume a timer
- Automatically cycle between:
  - 25-minute Work sessions
  - 5-minute Short breaks
  - 15-minute Long break after 4 sessions
- Track completed work sessions
- Customize session durations
- Receive audio notifications when sessions end
- Use the app on desktop and mobile devices

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript / TypeScript
- Vite
- PostCSS

### Production & DevOps
- Docker (Containerization)
- Nginx (Production web server)
- Docker Hub (Image registry)
- AWS EC2 (Cloud hosting)
- Linux

---


### Deployment Flow

1. Developed and tested locally with Vite
2. Generated optimized production build
3. Configured Nginx to serve static files
4. Created Docker image containing:
   - Nginx
   - Production build files
5. Pushed image to Docker Hub
6. Pulled image on AWS EC2
7. Ran container exposing port 80
8. Configured EC2 security group for HTTP access

This mirrors real-world production deployment practices.

---

## Project Structure

```plaintext
📂 Pomodoro Timer
├── src/
│   └── ...           # Source code (JS/TS, components, styles)
├── guidelines/       # Project guidelines or documentation
├── index.html        # Main HTML entry point
├── package.json      # Node.js project dependencies
├── vite.config.ts    # Vite configuration
├── postcss.config.js # PostCSS configuration
└── README.md         # This file
```
## 🐳 Docker

Build image:
~~~
docker build -t pomodoro-timer .
~~~

Run container:
~~~
docker run -d -p 80:80 pomodoro-timer
~~~

Pull from Docker Hub:
~~~
docker pull your-dockerhub-username/pomodoro-timer
~~~
☁️ AWS EC2 Deployment

- Launched Linux EC2 instance

- Installed Docker
  
- Pulled image from Docker Hub

- Ran container with:
~~~
docker run -d -p 80:80 your-dockerhub-username/pomodoro-timer

~~~
- Configured Security Group:

- Allowed inbound HTTP (port 80)

Application accessible via EC2 Public IP.
