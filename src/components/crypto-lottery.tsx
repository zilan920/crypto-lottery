"use client"

import React, { useState } from 'react';
import { ethers } from 'ethers';

import './crypto-lottery.css';

const CryptoLottery: React.FC = () => {
    const grid = Array.from({ length: 64 }, () => Array.from({ length: 16 }, (_, i) => i.toString(16)))

    const [selected, setSelected] = useState<string[]>([]);
    const [selectedNum, setSelectedNum] = useState<number>(0)
    const [address, setAddress] = useState<string>('');
    const [key, setKey] = useState<string>('')

    const drawOne = (index: number, cube: string) => {

        if (selected[index] === undefined) {
            selected[index] = cube
            setSelectedNum(n => {
                if (n + 1 === 64) {
                    generateAddress()
                }
                return n+1
            })
        }
        console.log(selected)
    }


    const handleClearClick = () => {
        setSelected([]);
        setAddress('');
        setKey('')
        setSelectedNum(0)
    };

    const generateAddress = () => {
        const privateKey = selected.join("")
        setKey(privateKey)
        const wallet = new ethers.Wallet(privateKey);
        const address = wallet.address;
        setAddress(address);
    }

    const openOnEtherScan = () => {
        window.open(`https://etherscan.io/address/${address}`)
    }

    return (
        <div className="crypto-lotter-container">
            <button className="clear-button" onClick={handleClearClick}>Clear</button>
            {<div className="key">Private Key: 0x{key}</div>}
            {<div className="address" onClick={openOnEtherScan}>Address(click to open): {address}</div>}
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className={`row`}>
                        <div>{selected[rowIndex] === undefined ? "⚫️" : "🟢"}</div>
                        {row.map((cube, cubeIndex) => (
                            <div
                                key={cubeIndex}
                                onMouseEnter={() => drawOne(rowIndex, cube)}
                                className={`cube ${selected[rowIndex] === cube ? "selected" : ""}`}>
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
