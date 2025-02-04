import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isoWeek from 'dayjs/plugin/isoWeek'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(localeData)
dayjs.extend(isoWeek)
dayjs.locale('ru')
