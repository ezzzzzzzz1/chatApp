const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// تحديد مسار الـ build للـ React
const _dirname = path.resolve();
const buildPath = path.join(_dirname, "../client/build");
app.use(express.static(buildPath));

// أي Route تاني يرجع ملف index.html
app.get("/*", (req, res) => {
    res.sendFile(
        path.join(buildPath, "index.html"),
        (err) => {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

// تشغيل Socket.io
io.on("connection", (socket) => {
    console.log('✅ New client connected');

    // استقبال الرسالة مرة واحدة فقط
    socket.removeAllListeners("chat"); // حذف أي Listeners قديمة
    socket.on("chat", (chat) => {
        console.log("💬 Received message:", chat);
        io.emit("chat", chat); // إرسال الرسالة لكل العملاء
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});

// تشغيل السيرفر
server.listen(process.env.PORT || 5001, () => console.log('🚀 Server running on port 5001'));
