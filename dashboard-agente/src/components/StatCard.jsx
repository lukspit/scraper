import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, label, value, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="glass p-6 rounded-2xl hover:glass-hover transition-all duration-300 group"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}
