document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded successfully.');

    function updateMaranelloTime() {
        const now = new Date();
        const options = {
            timeZone: 'Europe/Rome',
            hour: '2-digit',
            minute: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat('en-GB', options); 
        const parts = formatter.formatToParts(now);
    
        let day, month, year, hour, minute;
        parts.forEach(part => {
            if (part.type === 'month') month = part.value;
            if (part.type === 'day') day = part.value;
            if (part.type === 'year') year = part.value;
            if (part.type === 'hour') hour = part.value;
            if (part.type === 'minute') minute = part.value;
        });
    
        const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
        document.getElementById('maranello-time').innerText = formattedDate;
    }
    

    async function fetchRaceSchedule() {
        try {
            const response = await fetch('https://ergast.com/api/f1/current.json');
            const data = await response.json();
            return data.MRData.RaceTable.Races;
        } catch (error) {
            console.error('Error fetching race schedule:', error);
            return [];
        }
    }
    async function updateNextRaceTime() {
        const races = await fetchRaceSchedule();
        const now = new Date();
        const nextRace = races.find(race => new Date(race.date + 'T' + race.time) > now);

        if (nextRace) {
            const nextRaceDate = new Date(nextRace.date + 'T' + nextRace.time);
            setInterval(() => {
                const now = new Date();
                const timeDiff = nextRaceDate - now;

                if (timeDiff > 0) {
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                    document.getElementById('session-time').innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                } else {
                    document.getElementById('session-time').innerText = 'The session has started or passed!';
                }
            }, 1000);
        } else {
            document.getElementById('session-time').innerText = 'No upcoming races found!';
        }
    }
    setInterval(updateMaranelloTime, 1000);
    updateMaranelloTime();
    updateNextRaceTime();
});