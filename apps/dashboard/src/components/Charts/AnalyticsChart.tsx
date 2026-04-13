
import {Paper, Typography,  useMediaQuery} from '@mui/material'
import {ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';

interface AnalyticsChartProps {
    data: Array<{
    name: string;
    count: number;
    rate: number;
    }>;
    title?: string;
}



export default function AnalyticsChart({data, title= 'Analytics Overview' }: AnalyticsChartProps) {

        const isMobile = useMediaQuery('(max-width: 600px)')

        const isTablet = useMediaQuery('(max-width: 960px)')

        const chartHeight = isMobile ? 250 : isTablet ? 350 : 400;


    return (
        <Paper 
            sx={{
                p: 3,
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <Typography
            variant="h6"
            gutterBottom
             sx={{ 
            color: 'white',
            fontWeight: 600}}
            >
                {title}
            </Typography>

            <div style={{width: "100%", height: chartHeight }}>  {/*outer measurable box */}
                <ResponsiveContainer width="100%" height="100%">                   {/* fills the box */}

     {/*  This is WHERE the chart gets its food!
            Remember barChartData from Overview.tsx?
            [{ name: "page_view", count: 450, rate: 66 }]
            We pass that array in here
            Every child (Bar, Line) reads from this same data
     */}
                    <ComposedChart 
                        data={data}
                        margin={{ top: 20, right: 60, bottom: 20, left: 20 }}>                     {/* the chart engine */}
                        <XAxis 
                            dataKey="name"  
                            stroke="#ffffff50" 
                            tick={{ fill: '#ffffff90', fontSize: 12 }} />                        {/* bottom labels */}
                        <YAxis 
                             yAxisId="left"  
                             stroke="#ffffff50" 
                             tick={{ fill: '#ffffff90', fontSize: 12 }}
                             label={{ 
                                 value: 'Count',
                                 angle: -90,
                                 position: 'insideLeft',
                                 fill: '#ffffff70'
                             }}
                         />                        {/* left ruler */}
                        <YAxis 
                             yAxisId="right" 
                             orientation="right" 
                             stroke="#ffffff50"
                             tick={{ fill: '#ffffff90', fontSize: 12 }}
                             tickFormatter={(value) => `${value}%`}
                             label={{ 
                                 value: 'Rate %',
                                 angle: 90,
                                 position: 'insideRight',
                                 fill: '#ffffff70'
                            }}
                        />                        {/* right ruler */}
                        <Tooltip 
                            contentStyle={{
                                background: 'rgba(0, 0, 0, 0.85)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                 color: 'white'
                                 }}

                             formatter={(value: number, name: string) => {
                                 if (name === 'Event Rate %') {
                                     return [`${value.toFixed(1)}%`, name]
                                     }
                                 return [value.toLocaleString(), name]
                                   
                                }}
                        
                            />                      {/* hover box */}
                        <Legend
                            wrapperStyle={{
                            paddingTop: '20px',
                            color: 'white'
                            }}

                        formatter={(value: string) => (
                             <span style={{
                                 color: 'white',
                                 fontSize: '0.85rem',
                                  marginLeft: '4px'
                               }}>
                              {value}
                            </span>
                            )}

                         />                       {/* color keys */}
                        
                        <Bar 
                            yAxisId="left"
                            dataKey="count"
                            fill="#6366f1"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                            name="Event Count"
                        />                          {/* the column   */}                     
                        <Line 
                             yAxisId="right"
                             type="monotone"
                             dataKey="rate"
                             stroke="#10b981"
                             strokeWidth={2}
                             dot={{ fill: '#10b981', r: 4 }}
                             activeDot={{ r: 6 }}
                             name="Event Rate %"
                        />                         {/* the trend line */}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    )
}


