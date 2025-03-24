import { LineChart } from '@mui/x-charts/LineChart';
import useAxiosPrivate from '@/app/hooks/useAxiosPrivate';
import { useState, useEffect } from 'react';

const currentMonth = new Date().getMonth() + 1;
const xLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dev'
].slice(0, currentMonth);

export default function EventLineChart() {
    const api = useAxiosPrivate();
    const [monthlyParticipationData, setMonthlyParticipationData] = useState([]);

    useEffect(() => {
        async function fetchMonthlyParticipationData(params) {
            try{
                const {data} = await api.get("/eventParticipation/getMonthlyParticipation");
                const monthlyParticipations = Array(currentMonth).fill(0);
                data.forEach(item => {
                    const monthIndex = item.month - 1;
                    monthlyParticipations[monthIndex] = item.participationCount;
                })
                setMonthlyParticipationData(monthlyParticipations)
            }
            catch(err){
                console.error(err);
            }
        }

        fetchMonthlyParticipationData()
    },[])

    return (
    <div className='w-full max-w-[800px]'>
        <LineChart
        height={300}
        series={[
            { data: monthlyParticipationData, label: 'All Events' }
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
    </div>
  );
}