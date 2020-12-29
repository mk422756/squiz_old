import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import {getCollections} from 'clients/collection'
import CollectionTile from 'components/CollectionTile'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'components/Button'
import {getIsLogin} from '../clients/auth'

const LandingBox = () => {
  return (
    <div className="bg-white p-4">
      <p className="text-2xl text-center mt-4 font-semibold">
        問題集を探してみよう！
      </p>
      <p className="text-lg text-center mt-4 font-semibold">
        必要な問題集を見つけて、
        <br />
        効率的に学習を始めましょう！
      </p>
      <div className="text-center mt-4">
        <Image
          src="/landing.png"
          alt="landing image"
          width={209}
          height={143}
        ></Image>
      </div>
      <div className="text-center my-4">
        <Button>
          <Link href="about">
            <a>SQUIZとは？</a>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function Home() {
  const [collections, setCollections] = useState([])
  const isLogin = getIsLogin()
  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const collections = await getCollections()
      if (!unmounted) {
        setCollections(collections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [])
  return (
    <Layout>
      <main>
        {!isLogin && <LandingBox></LandingBox>}
        <div className="mt-2">
          {collections.map((collection) => {
            return (
              <div className="mt-1">
                <CollectionTile
                  key={collection.id}
                  collection={collection}
                ></CollectionTile>
              </div>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}
