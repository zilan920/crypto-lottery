import Image from 'next/image'
import styles from './page.module.css'
import CryptoLottery from '@/components/crypto-lottery'

export default function Home() {
  return (
    <main className={styles.main}>
      <CryptoLottery /> 
    </main>
  )
}
