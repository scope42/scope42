import { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'
import 'antd/es/date-picker/style/index'

const DayjsDatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)

export default DayjsDatePicker
