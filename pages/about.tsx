import Layout from 'layouts/layout'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'components/Button'
import {useRecoilValue} from 'recoil'
import {userIsLoginState} from 'store/userState'

export default function About() {
  const isLogin = useRecoilValue(userIsLoginState)
  return (
    <Layout>
      <main>
        <div className="bg-white p-4">
          <p className="text-2xl font-semibold text-center my-8">SQUIZとは？</p>
          <p className="text-lg font-semibold text-center">
            オンラインで学習するための
            <br />
            新しい学習プラットフォームです
          </p>
          <div className="mt-4 text-center">
            <Image
              src="/about.svg"
              alt="about image"
              width={227}
              height={167}
            ></Image>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold">
              問題集を解いてスキルアップしましょう
            </p>
            <p className="p-4 m-2 leading-7 inline-block text-left">
              資格勉強や、スキルアップのために繰り返し学習しましょう。
              <br />
              進捗管理や間違った問題だけ再挑戦することができ、効率的に学習できます。
            </p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold">
              オリジナルの問題集を作成しましょう
            </p>
            <p className="p-4 m-2 leading-7  inline-block text-left">
              自分だけの問題集を作成することができます。
              <br />
              作成した問題集は公開して、他のユーザーに共有することができます。
            </p>
          </div>
          {isLogin ? (
            <div className="my-8 text-center">
              <Button>
                <Link href="/">
                  <a>トップページに戻る</a>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="my-8 text-center">
              <Button>
                <Link href="signup">
                  <a>新規登録する</a>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}
