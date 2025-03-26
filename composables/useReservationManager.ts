import { ref, onMounted } from 'vue'
import type { EventInput, CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es'
import { fetchProfessionalReservations } from '@/services/reservationService'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ReservationPayload } from '@/types/ReservationTypes'  // Importa la interfaz

export function useReservationManager() {
  const events = ref<EventInput[]>([])
  const showModal = ref(false)
  const selectedReservation = ref<{ 
    title: string; 
    start: string; 
    duration: number; 
    email?: string; 
    message?: string 
  } | null>(null)

  const calendarOptions = ref<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events.value,
    eventClick: (info) => {
      selectedReservation.value = {
        title: info.event.title,
        start: info.event.start ? format(new Date(info.event.start), "PPPP p", { locale: es }) : '',
        duration: info.event.extendedProps?.duration || 60,
        email: info.event.extendedProps?.email || '',
        message: info.event.extendedProps?.message || '',
      }
      showModal.value = true
    }
  })

  const loadReservations = async () => {
    try {
      const reservations: ReservationPayload[] = await fetchProfessionalReservations()
      events.value = reservations.map((res: ReservationPayload) => ({
        id: String(res.id),
        title: res.name,
        start: new Date(`${res.date} ${res.time}`).toISOString(),
        duration: res.duration || 60,
        email: res.email,
        message: res.message
      }))
      calendarOptions.value.events = events.value
    } catch (error) {
      console.error('Error al obtener las reservas:', error)
    }
  }

  onMounted(() => {
    loadReservations()
  })

  return { events, calendarOptions, showModal, selectedReservation }
}
