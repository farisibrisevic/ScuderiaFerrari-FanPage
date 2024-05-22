document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded successfully.');

    // Function to get the current time in Maranello
    function updateMaranelloTime() {
        const now = new Date();
        const options = {
            timeZone: 'Europe/Rome', // Maranello is in the same timezone as Rome
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat([], options);
        document.getElementById('maranello-time').innerText = formatter.format(now);
    }

    // Function to fetch the current season race schedule from the Ergast API
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

    // Function to find the next race and update the countdown
    async function updateNextRaceTime() {
        const races = await fetchRaceSchedule();
        const now = new Date();

        // Find the next race
        const nextRace = races.find(race => new Date(race.date + 'T' + race.time) > now);

        if (nextRace) {
            const nextRaceDate = new Date(nextRace.date + 'T' + nextRace.time);

            // Update countdown every second
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

    // Update the time every second
    setInterval(updateMaranelloTime, 1000);

    // Initial calls to display the time immediately
    updateMaranelloTime();
    updateNextRaceTime();
});
