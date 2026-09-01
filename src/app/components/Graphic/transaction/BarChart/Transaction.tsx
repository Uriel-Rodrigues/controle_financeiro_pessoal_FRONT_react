'use client'
// importar hooks do react
import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

//definir tipo de dados esperados
interface TransactionBarChartProps {
    data: {month: string, transactions: number}[]
} 
const TransactionBarChart = ({data}: TransactionBarChartProps ) => {
    return (
        <div className="w-full h-96">
            <h2 className=" text-base font-semibold text-gray-700">transações mensais</h2>
            <ResponsiveContainer width="100%" height= "100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        left: -25,
                        bottom: 25,
                    }}
                    >
                    <CartesianGrid strokeDasharray="0"/>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="#3182CE" barSize={50} />

                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}

export default TransactionBarChart
