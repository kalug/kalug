import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

export default function Calendar() {
  return (
    <div className="demo-app-main">
      <FullCalendar
        plugins={[dayGridPlugin, googleCalendarPlugin]}
        headerToolbar={{
          left: "",
          center: "title",
          //right: 'dayGridWeek,dayGridDay' // user can switch between the two
        }}
        googleCalendarApiKey="AIzaSyCuWMvbJMh8InLaE1Qk8-bHUjJbm8iYvPU"
        events={{
          googleCalendarId:
            "9bdrfj0lhcdisp5r9duptff06c@group.calendar.google.com",
        }}
        //initialView="dayGridMonth"
        initialView="dayGridWeek"
        views={{
          dayGridWeek: {
            type: "dayGrid",
            duration: { weeks: 3 },
          },
        }}
        //fixedWeekCount={3}
        height={"50vh"} // カレンダーの高さを制限
        // 日本語化
        //locale={jaLocale}
        // イベントの表示形式
        eventDisplay={"block"} // イベントをブロック要素として表示
        eventTimeFormat={{
          // 時刻フォーマット'14:30'
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
      />
    </div>
  );
}
