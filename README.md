# Insurechain
Insurechain is a blockchain which enables seamless porting of the policies, allowing interoperability and interaction between various private chains run by insurance companies

# Problem Statement
The current process for porting insurance policies is time consuming, expensive and leads to errors in data and ultimately loss of coverage for the customer. When customers move from one insurer to another, the entire data footprint eg KYC docs, claims, medical docs etc. is created all over again. This means the process folowed to port the policy is the same as the process of creating a new policy. This leads to increased costs and lead time,costs and possible loss of cover for the customer in case all the claims data cannot be produced at the new insurer. 

## Idea behind Insurechain
1. Hybrid blockchain includes benefits of both the openness of a public blockchain and restriction of a private network by limiting the access to join a network
2. Private networks generate the record of transactions which are stored and verified on the public blockchain. These help in faster transaction speeds, privacy of the data.
3. Insurechain is a solution which allows the enterprise to maintain a layer of privacy, along with scalability of transactions. Not only this, enterprises can take advantage of existing public blockchain, ethereum in this case, for security and validation. 
4. This helps the enterprise get the scalability of transactions like private network by building on sidechain by Matic, validate transactions through a trust-minimized network by using public checkpointing validators and get benefit of Ethereum public chain’s security.

## Architecture
The basic working architecture of the public Matic Network chain can be studied here. However, here we take a step further and provide flexibility to what can be built on Matic Network. Apart from the public sidechain, we can build an enterprise sidechain or optimistic rollup sidechain or any other sidechain that wants to interact with the existing public architecture of Matic Network and benefit from the security provided by a public chain such as ethereum.


![Insurechain PPS](https://github.com/M-SETU/Insurechain/blob/master/PPS.png "Insurechain Architecture")


WIP





