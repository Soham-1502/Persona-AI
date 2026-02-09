import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: 'User' // ← Add this to match your Reminder model
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
            console.log(`✅ Database Name: ${mongoose.connection.db.databaseName}`);
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        throw error;
    }

    return cached.conn;
}