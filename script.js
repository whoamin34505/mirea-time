document.addEventListener('DOMContentLoaded', function() {
    const schedule = [
        { start: "09:00", end: "10:30", type: "lesson" },   // 1-я пара
        { start: "10:30", end: "10:40", type: "break" },    // 1-я перемена
        { start: "10:40", end: "12:10", type: "lesson" },   // 2-я пара
        { start: "12:10", end: "12:40", type: "break" },    // 2-я перемена
        { start: "12:40", end: "14:10", type: "lesson" },   // 3-я пара
        { start: "14:10", end: "14:20", type: "break" },    // 3-я перемена
        { start: "14:20", end: "15:50", type: "lesson" },   // 4-я пара
        { start: "15:50", end: "16:20", type: "break" },    // 4-я перемена
        { start: "16:20", end: "17:50", type: "lesson" },   // 5-я пара
        { start: "17:50", end: "18:00", type: "break" },    // 5-я перемена
        { start: "18:00", end: "19:30", type: "lesson" },   // 6-я пара
    ];

    let testTime = null; // Переменная для тестирования

    function formatTime(date) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function calculateTimeUntilNextLesson() {
        const now = testTime ? new Date(testTime) : new Date(); // Используем тестовое время, если оно задано
        let currentEvent = null;
        let nextEvent = null;
        let timeUntilEvent = 0;

        for (let i = 0; i < schedule.length; i++) {
            const event = schedule[i];
            const [startHour, startMinute] = event.start.split(':').map(Number);
            const [endHour, endMinute] = event.end.split(':').map(Number);
            
            const eventStart = new Date(now);
            eventStart.setHours(startHour, startMinute, 0);
            
            const eventEnd = new Date(now);
            eventEnd.setHours(endHour, endMinute, 0);

            // Проверка, идет ли сейчас пара или перемена
            if (now >= eventStart && now <= eventEnd) {
                currentEvent = event;
                timeUntilEvent = (eventEnd - now) / 1000; // Время до конца текущего события в секундах
                break;
            }

            // Проверка, какое событие следующее
            if (now < eventStart && !nextEvent) {
                nextEvent = event;
                timeUntilEvent = (eventStart - now) / 1000; // Время до начала следующего события в секундах
            }
        }

        if (currentEvent) {
            const hours = Math.floor(timeUntilEvent / 3600);
            const minutes = Math.floor((timeUntilEvent % 3600) / 60);
            const seconds = Math.floor(timeUntilEvent % 60);

            const timeString = [
                hours > 0 ? `${hours} час${hours > 1 ? 'а' : ''}` : '',
                minutes > 0 ? `${minutes} минут${minutes > 1 ? 'ы' : 'а'}` : '',
                `${seconds} секунд${seconds > 1 ? 'ы' : 'а'}`
            ].filter(Boolean).join(' ');

            if (currentEvent.type === "lesson") {
                document.getElementById('time-info').innerText = `Сейчас идет ${schedule.indexOf(currentEvent) / 2 + 1} пара. \n До конца пары осталось: ${timeString}`;
            } else {
                document.getElementById('time-info').innerText = `Сейчас идет перемена. До начала следующей пары осталось: ${timeString}`;
            }
        } else if (nextEvent) {
            const hours = Math.floor(timeUntilEvent / 3600);
            const minutes = Math.floor((timeUntilEvent % 3600) / 60);
            const seconds = Math.floor(timeUntilEvent % 60);

            const timeString = [
                hours > 0 ? `${hours} час${hours > 1 ? 'а' : ''}` : '',
                minutes > 0 ? `${minutes} минут${minutes > 1 ? 'ы' : 'а'}` : '',
                `${seconds} секунд${seconds > 1 ? 'ы' : 'а'}`
            ].filter(Boolean).join(' ');

            document.getElementById('time-info').innerText = `До начала следующей пары (${nextEvent.start}) осталось: ${timeString}`;
        } else {
            document.getElementById('time-info').innerText = `Сегодня пар больше нет.`;
        }
    }

    function setTestTime(hour, minute, second) {
        const now = new Date();
        testTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
        calculateTimeUntilNextLesson(); // Пересчитываем время сразу
    }

    window.setTestTime = setTestTime; // Добавляем функцию в глобальный объект window для доступа из консоли

    calculateTimeUntilNextLesson(); // Немедленный вызов функции для начального отображения
    setInterval(calculateTimeUntilNextLesson, 1000); // Обновляем каждую секунду
});
