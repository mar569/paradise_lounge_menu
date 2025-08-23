import React, { useState } from 'react';
import { CiStar } from "react-icons/ci";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../lightswind/Accordion';
import { motion } from 'framer-motion';

const BonusProgram: React.FC = () => {
    const [isBonusAccordionOpen, setIsBonusAccordionOpen] = useState(false);

    return (
        <div className='flex flex-col ml-1'>
            <span
                onClick={() => setIsBonusAccordionOpen(!isBonusAccordionOpen)}
                className="mt-4 text-[#fff] cursor-pointer "
            >
                <div className='flex items-center btn-history'>
                    <CiStar size={24} className='mr-2 cursor-pointer' />
                    {isBonusAccordionOpen ? "Скрыть бонусную программу" : "О бонусной программе"}
                </div>
            </span>
            {isBonusAccordionOpen && (
                <motion.div
                    className="mt-4 p-4 bg-black/60 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.9 }}
                >
                    <Accordion>
                        <AccordionItem value="bonus1">
                            <AccordionTrigger>Что такое бонусная программа</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff] text-[16px]'>Бонусная программа предоставляет возможность получать баллы за каждую покупку. Накопленные баллы можно оплатить до 10% от всей суммы покупки.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus2">
                            <AccordionTrigger>Как работает кэшбэк?</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>За каждое посещение и заказ в "Paradise Lounge" вы накапливаете баллы.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus3">
                            <AccordionTrigger>Как использовать кэшбэк?</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>В рамках одного заказа вы можете либо накопить баллы, либо списать их для оплаты части счета.
                                    Обратите внимание: при списании баллов на сумму заказа не начисляются новые баллы.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus4">
                            <AccordionTrigger>Как повысить уровень кэшбэка?</AccordionTrigger>
                            <AccordionContent>
                                <p className='text-[#fff]'>Увеличивайте количество посещений и покупок, чтобы повысить уровень кэшбэка до 10%!</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bonus5">
                            <AccordionTrigger>Баллы</AccordionTrigger>
                            <AccordionContent>
                                <h2 className='text-[#fff] text-[18px]' style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}> 1 балл = 1 рубль. </h2>
                                <div className='mt-4 border-1 border-[#875ed3] p-4 rounded-2xl'>
                                    <h3 className='text-[#875ed3] text-xl mb-1'>Cashback 0%</h3>
                                    <p className='text-[#fff]'>
                                        Чтобы начать накапливать и тратить баллы, совершите 4 посещения на общую сумму 4.000₽ для перехода на следующий уровень — 3%.
                                    </p>
                                </div>

                                <div className='mt-4 border-1 border-[#875ed3] p-4 rounded-2xl'>
                                    <h3 className='text-[#875ed3] text-xl mb-1'>Cashback 5%</h3>
                                    <p className='text-[#fff]'>
                                        Совершите не менее 20 посещений на общую сумму 20.000₽ и получите статус "Мастер релакса".
                                    </p>
                                </div>

                                <div className='mt-4 border-1 border-[#875ed3] p-4 rounded-2xl'>
                                    <h3 className='text-[#875ed3] text-xl mb-1'>Cashback 10%</h3>
                                    <p className='text-[#fff]'>
                                        Совершите не менее 50 посещений на общую сумму 50.000₽ и получите статус "Гуру комфорта".
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            )}
        </div>
    );
};

export default BonusProgram;
