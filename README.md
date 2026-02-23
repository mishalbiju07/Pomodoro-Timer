# 🍅 Pomodoro Timer – Production-Ready Web Application

A modern Pomodoro Timer built with a Vite-based frontend stack, containerized using Docker, served via Nginx, and deployed on AWS EC2.

This project demonstrates frontend development, production optimization, containerization, and cloud deployment using real-world engineering practices.

---

## 🚀 Live Application

🔗 http://65.2.124.193:8080/ 

(it may not always work because the Amazon server might be offline or shut down. Please refer to the screenshots below if the live page does not work)
<img width="1896" height="922" alt="Screenshot 2026-02-24 000725" src="https://github.com/user-attachments/assets/35b1bb85-1e0c-4e8a-87f1-f4d23ab0271b" />

<img width="1919" height="919" alt="Screenshot 2026-02-24 000800" src="https://github.com/user-attachments/assets/a00b5128-9613-4ed4-b07b-1561c1267043" />

<img width="1919" height="909" alt="Screenshot 2026-02-24 001009" src="https://github.com/user-attachments/assets/dd86b4e3-7839-40c2-8725-c555ead0372e" />

<img width="1919" height="919" alt="Screenshot 2026-02-24 001030" src="https://github.com/user-attachments/assets/963697f3-8be7-4c31-9805-18b27c71e007" />
<img width="1919" height="919" alt="Screenshot 2026-02-24 001052" src="https://github.com/user-attachments/assets/d8bda4d5-e7d1-4cc0-b49d-c3ae24df4c93" />


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
