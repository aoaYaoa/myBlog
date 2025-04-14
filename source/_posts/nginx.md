---
title: nginx 学习配置记录
date: 2025-01-07
tags:
  - 性能优化
cover: /img/nginx.png
---

# Nginx Web 服务器配置

一个生产环境ready的Nginx配置模板，包含HTTP/2、SSL、安全头信息和性能优化。

## 📋 特性

- 支持HTTP/2以提升性能
- 自动HTTP到HTTPS重定向
- 现代SSL/TLS配置与安全密码套件
- 静态文件缓存以提高性能
- Gzip压缩以减少带宽使用
- PHP-FPM支持PHP应用
- 后端服务的反向代理配置
- 包括HSTS在内的安全头信息
- 优化的性能设置

## 🚀 安装

### 前提条件

- Nginx (建议1.18+版本)
- 用于SSL/TLS支持的OpenSSL
- 有效的SSL证书(用于HTTPS支持)

### 安装步骤

1. **安装Nginx:**

   ```bash
   # Debian/Ubuntu
   sudo apt update
   sudo apt install nginx
   
   # CentOS/RHEL
   sudo yum install epel-release
   sudo yum install nginx
   
   # macOS
   brew install nginx
   ```

2. **替换默认Nginx配置:**

   将`nginx.conf`文件复制到Nginx配置目录:

   ```bash
   sudo cp nginx.conf /etc/nginx/nginx.conf
   ```

3. **创建SSL证书目录:**

   ```bash
   sudo mkdir -p /etc/nginx/ssl
   ```

4. **安装SSL证书:**

   将SSL证书和密钥文件放在`/etc/nginx/ssl/`目录中:
   
   ```bash
   sudo cp example.com.crt /etc/nginx/ssl/
   sudo cp example.com.key /etc/nginx/ssl/
   ```

   如果你没有证书，可以使用Let's Encrypt生成:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d example.com -d www.example.com
   ```

5. **更新域名:**

   编辑配置文件，将`example.com`替换为你的实际域名。

6. **测试配置:**

   ```bash
   sudo nginx -t
   ```

7. **重启Nginx:**

   ```bash
   sudo systemctl restart nginx
   ```

## ⚙️ 配置详情

### 文件结构

配置分为以下几个部分:

- **全局设置**: 用户、进程、日志和PID文件
- **事件块**: 连接处理
- **HTTP块**: MIME类型、日志和性能优化
- **Server块**: 单个网站配置

### 关键配置元素

#### SSL/TLS设置

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
```

#### HSTS设置

```nginx
add_header Strict-Transport-Security "max-age=63072000" always;
```

#### 反向代理

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    # 其他头信息...
}
```

## 🔧 自定义

### 添加新站点

1. 在`/etc/nginx/conf.d/example.conf`创建新的server块:

   ```nginx
   server {
       listen 443 ssl http2;
       server_name newsite.com;
       
       ssl_certificate /etc/nginx/ssl/newsite.com.crt;
       ssl_certificate_key /etc/nginx/ssl/newsite.com.key;
       
       root /var/www/newsite.com;
       # 其他配置...
   }
   ```

2. 创建HTTP到HTTPS重定向:

   ```nginx
   server {
       listen 80;
       server_name newsite.com;
       return 301 https://$host$request_uri;
   }
   ```

### 调整性能设置

你可以根据服务器资源调整以下设置:

- `worker_processes`: 设置为CPU核心数
- `worker_connections`: 高流量站点可增加此值
- `keepalive_timeout`: 根据应用需求调整
- `client_max_body_size`: 根据上传需求设置

## 🛡️ 安全考虑

此配置包含几项安全增强:

- 现代TLS协议和密码套件
- HTTP严格传输安全(HSTS)
- 限制访问隐藏文件
- 防止MIME类型嗅探的头信息

额外建议:

- 为登录页面和API端点启用速率限制
- 考虑添加ModSecurity作为Web应用防火墙
- 实现Content-Security-Policy头信息
- 定期更新Nginx到最新版本

## 📊 监控和日志

### 日志位置

- 访问日志: `/var/log/nginx/access.log`
- 错误日志: `/var/log/nginx/error.log`

### 实用命令

```bash
# 查看实时日志
tail -f /var/log/nginx/error.log

# 检查语法错误
nginx -t

# 重新加载配置
nginx -s reload

# 检查Nginx状态
systemctl status nginx
```

## 📝 许可

此配置基于MIT许可提供。你可以自由修改并用于你的项目。

## 🙏 致谢

此配置整合了以下来源的最佳实践:

- [Mozilla SSL配置生成器](https://ssl-config.mozilla.org/)
- [Nginx加固指南](https://www.acunetix.com/blog/web-security-zone/hardening-nginx/)
- 各种DevOps社区资源

---

⭐ 如果你觉得这个配置有用，请为仓库点星 ⭐ 