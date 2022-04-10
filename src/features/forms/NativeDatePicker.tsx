import { PickerProps } from 'antd/lib/date-picker/generatePicker'
import dayjs from 'dayjs'
import React from 'react'
import DayjsDatePicker from './DayjsDatePicker'

export const NativeDatePicker: React.VFC<PickerProps<Date>> = React.forwardRef(
  (props, ref) => {
    const {
      value,
      defaultValue,
      defaultPickerValue,
      disabledDate,
      dateRender,
      monthCellRender,
      onPanelChange,
      onChange,
      onSelect,
      ...restProps
    } = props
    return (
      <DayjsDatePicker
        ref={ref as any}
        value={value ? dayjs(value) : value}
        defaultValue={defaultValue ? dayjs(defaultValue) : defaultValue}
        defaultPickerValue={
          defaultPickerValue ? dayjs(defaultPickerValue) : defaultPickerValue
        }
        disabledDate={
          disabledDate
            ? dayjsDate => disabledDate(dayjsDate.toDate())
            : disabledDate
        }
        dateRender={
          dateRender
            ? (currentDate, today) =>
                dateRender(currentDate.toDate(), today.toDate())
            : dateRender
        }
        monthCellRender={
          monthCellRender
            ? (currentDate, locale) =>
                monthCellRender(currentDate.toDate(), locale)
            : monthCellRender
        }
        onPanelChange={
          onPanelChange
            ? (value, mode) => onPanelChange(value.toDate(), mode)
            : onPanelChange
        }
        onChange={
          onChange
            ? (dayjsDate, dateString) =>
                onChange(dayjsDate ? dayjsDate.toDate() : null, dateString)
            : onChange
        }
        onSelect={
          onSelect ? dayjsDate => onSelect(dayjsDate.toDate()) : onSelect
        }
        {
          ...(restProps as any) /* There is more to map that we currently don't need */
        }
      />
    )
  }
)
