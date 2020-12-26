import { dateToYYYYMMDD } from "./dateUtils"

describe("dateToYYYYMMDD", () => {
  it("DateオブジェクトをYYYY年MM月D日に変換", () => {
    const date = new Date("2020-12-05T00:00:00")
    const ret = dateToYYYYMMDD(date)
    expect(ret).toEqual("2020年12月5日")
  })

  it("DateオブジェクトをYYYY年MM月DD日に変換", () => {
    const date = new Date("2020-12-15T00:00:00")
    const ret = dateToYYYYMMDD(date)
    expect(ret).toEqual("2020年12月15日")
  })
})
