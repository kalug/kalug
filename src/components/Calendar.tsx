import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar';
//import jaLocale from '@fullcalendar/core/locales/ja'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [holidays, setHolidays] = useState({})

  const fetchHolidays = async () => {
    try {
      const response = await fetch('/api/holiday')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setHolidays(data)
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      console.log('fetchEvents')
      const response = await fetch('/api/event')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log(data)
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    // APIからデータ取得
    //fetchHolidays()
    //fetchEvents()
  }, [])

  // 日付セルのレンダリング
  const renderDayCellContent = (dayCellContent) => {
    // 月ビュー以外は何もしない
    if (dayCellContent.view.type !== 'dayGridMonth') return

    const dateStr = dayCellContent.date.toLocaleDateString('sv-SE')
    const holidayName = holidays[dateStr]
    const isHoliday = Boolean(holidayName)

    return (
      <>
        <span className={isHoliday ? 'holiday-number' : ''}>{dayCellContent.date.getDate()}</span>
        {isHoliday ? <span className="holiday-label">{holidayName}</span> : null}
      </>
    )
  }

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
        //initialView="listDayFormat"
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
