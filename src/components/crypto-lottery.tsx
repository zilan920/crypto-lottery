"use client"

import React, {useEffect, useMemo, useState} from 'react';
import {ethers} from 'ethers';

import './crypto-lottery.css';
import * as crypto from "crypto";
import {useRequest} from "ahooks";

const API_KEY = "UBTFP9UPTK42FM9PEFW4VX7JZPE3PBFG2A"
const getBalance = async (addr: string) => {
    let response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=${API_KEY}`);
    if (response.status === 200) {
        return await response.json()
    }
}
const CryptoLottery: React.FC = () => {

    const grid = Array.from({length: 64}, () => Array.from({length: 16}, (_, i) => i.toString(16)))
    const [privateKey, setPrivateKey] = useState<string>('')
    const [address, setAddress] = useState<string>('');
    const [count, setCount] = useState<number>(0)

    const {run , data, loading} = useRequest(getBalance, {
        onSuccess: r => {
            if (r.result === "0") {
                setTimeout(randomKey, 350)
            }
        }
    })

    const randomKey = useMemo(() => () => {
        crypto.randomBytes(32, (err, buf) => {
            if (err) throw err;
            setCount(c  => c+1)
            setPrivateKey(buf.toString('hex'))
            const wallet = new ethers.Wallet(buf.toString('hex'));
            console.log(`key: ${buf.toString('hex')}, addr : ${wallet.address}`);
            setAddress(wallet.address);
            run(wallet.address)
        })
    }, [run])

    useEffect(randomKey, [randomKey])

    const openOnEtherScan = () => {
        window.open(`https://etherscan.io/address/${address}`)
    }

    return (
        <div className="crypto-lotter-container">
            {/*<button className="clear-button" onClick={handleClearClick}>Clear</button>*/}
            {<div className="key">Private Key: {privateKey}, (round {count})</div>}
            {<div className="address" onClick={openOnEtherScan}>Address {address}, Balance : <b>{loading ? "......." : data.result}</b></div>}
            <div className={`grid`}>
                {grid.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className={`row`}>
                        {row.map((cube, cubeIndex) => (
                            <div
                                key={cubeIndex}
                                className={`cube ${privateKey[rowIndex] === cube ? "selected" : "unselected"}`}>
                                {cube}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CryptoLottery;
