"use client";
import { useBusiness } from '@/lib/ContextAPI/businessTypeId';
import React, { useEffect } from 'react'

export default function FinalCartBusinessSolution({businessIdd}: {businessIdd: number}) {
    const { businessId, setBusinessId } = useBusiness(); 
    useEffect(() =>{
        setBusinessId(businessIdd)
    },[businessId, setBusinessId]);
    
  return null;
}
