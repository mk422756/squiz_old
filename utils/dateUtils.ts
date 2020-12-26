import dayjs from "dayjs"

export function dateToYYYYMMDD(date: Date): string {
  return dayjs(date).format("YYYY年MM月D日")
}
