import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar';

export default function Calendar() {
  return (
    <div className="demo-app-main">
      <FullCalendar
        plugins={[dayGridPlugin,googleCalendarPlugin]}
        headerToolbar={{
          left: '',
          center: 'title'
        }}
	googleCalendarApiKey='AIzaSyCuWMvbJMh8InLaE1Qk8-bHUjJbm8iYvPU'
	events={{
	    googleCalendarId:'9bdrfj0lhcdisp5r9duptff06c@group.calendar.google.com'
	}}
        initialView="dayGridMonth"
        dayMaxEvents={true} // 日付枠内に表示できるイベント数を制限
        businessHours={true} // 土日をグレーアウト
        fixedWeekCount={false} // 週数を固定しない⇒月の週数が変わる
        height={'90vh'} // カレンダーの高さを制限
        // 日本語化
        //locale={jaLocale}
        // イベントの表示形式
        eventDisplay={'block'} // イベントをブロック要素として表示
        eventTimeFormat={{
          // 時刻フォーマット'14:30'
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
      />
    </div>
  )
}
