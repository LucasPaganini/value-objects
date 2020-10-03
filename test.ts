import { VOOptional } from '.'

class Test {
  constructor(raw: number) {}
  valueOf(): string {
    return ''
  }
}
new Test(123).valueOf()

new (VOOptional<typeof Test, null | undefined>(Test, [null, undefined]))(434).valueOf()
new (VOOptional(Test, [null]))(123).valueOf()
new (VOOptional(Test, [undefined]))(434).valueOf()
new (VOOptional(Test, []))(434).valueOf()
new (VOOptional(Test))(434).valueOf()
