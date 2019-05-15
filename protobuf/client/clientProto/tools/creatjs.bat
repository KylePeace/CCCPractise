@echo off
echo "start" 

pbjs -t static-module -w commonjs -o ./out/pb_Login.js ./proto/pb_Login.proto

echo "end" 

pause