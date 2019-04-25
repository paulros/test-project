## Drop setguid and setuid capabilities
`$ docker run -d --cap-drop SETGUID --cap-drop SETUID nginx`

## Read-only containers
`$ docker run --name mysql --read-only -v /var/lib/mysql -v /tmp --e MYSQL_ROOT_PASSWORD=password -d mysql` 

## Links
[Docker Secure Deployment Guidlines](https://github.com/GDSSecurity/Docker-Secure-Deployment-Guidelines)

[Security benchmarks](https://www.cisecurity.org/cis-benchmarks/)
[docker bench security](https://github.com/docker/docker-bench-security)