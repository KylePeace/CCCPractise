 
@echo off
for /f "tokens=4" %%a in ('route print^|findstr 0.0.0.0.*0.0.0.0') do (
 set IP=%%a
)
echo %IP%

python3 -m http.server  --bind  %IP%  8080
::python httpsever.py
::python3 -m http.server  --bind  192.168.1.46  80

 pause