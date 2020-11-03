# Insurechain
Insurechain is a hybrid blockchain which enables seamless porting of the policies between different vendors, allowing interoperability and interaction between 
various private chains.

## Idea behind Insurechain
1. Hybrid blockchain includes benefits of both the openness of a public blockchain and restriction of a private network by limiting the access to join a network
2. Private networks generate the record of transactions which are stored and verified on the public blockchain. These help in faster transaction speeds, privacy of the data.
3. Insurechain is a solution which allows the enterprise to maintain a layer of privacy, along with scalability of transactions. Not only this, enterprises can take advantage of existing public blockchain, ethereum in this case, for security and validation. 
4. This helps the enterprise get the scalability of transactions like private network by building on sidechain by Matic, validate transactions through a trust-minimized network by using public checkpointing validators and get benefit of Ethereum public chain’s security.

# Problem Statement
There are two main problems which need to be solved:

1. Broken Process
The current process for porting insurance policies is time consuming, expensive and leads to errors in data and ultimately loss of coverage for the customer. When customers move from one insurer to another, the entire data footprint eg KYC docs, claims, medical docs etc. is created all over again. This means the process folowed to port the policy is the same as the process of creating a new policy. This leads to increased costs and lead time,costs and possible loss of cover for the customer in case all the claims data cannot be produced at the new insurer. 

2. No Trasnparency or Accountability
Even if two insurers are willing to co-operate with each other, there is no transparency in the process. This means that no SLA's can be enforced on porting the insurance and government bodies like IRDAI will also not have any visibility on the 

## Public Blockchain Architecture
The basic working architecture of the public Matic Network chain can be studied here. However, here we take a step further and provide flexibility to what can be built on Matic Network. Apart from the public sidechain, we can build an enterprise sidechain or optimistic rollup sidechain or any other sidechain that wants to interact with the existing public architecture of Matic Network and benefit from the security provided by a public chain such as ethereum.

### How Does it Work
1. A user does a normal transaction off-chain to an aggregator (block producer)
2. The transaction goes to aggregator 
3. The aggregator bonds multiple user-transactions into a sidechain
4. The aggregator computes a new state root and creates a ethereum mainchain transaction and publishes it

The major advantage is that it batches transactions on-chain, and reduces cost of user transaction. In this approach, not all of the data is exposed. The transaction data required for calling transactions, is transferred. However, the issue is that all the transactions are published. 

![Insurechain PPS](https://github.com/M-SETU/Insurechain/blob/master/PPS.png "Matic Architecture")

# Using Public Ledger versus Private Ledger
We have decided to use public ledgers to do the porting as it leads to reduced costs and increased security. This also prevents any particular insurer or government body from having dispropotionate power or influence in this system. 
The concept can be deployed using a permissioned ledger as well, but this will lead to centralization of power, where the body running the private infrastructure will have the power to add/remove nodes and thereby control which transactions are valid and which ones are not. This will ultimately defeat the purpose of using blockchain technology as this system would not be trustless.  

However, the public ledger used to build this system should have high performance and low cost per transaction to make the system viable. For this purpose we have decided to use the Matic Network public ledger as it support 7200+ TPS at a Txn cost less than $0.00003. 

# Technology used in the POC
The POC is using a Goerli chain and 2 Matic chains to simulate the porting mechainsm between the insurance providers. 

![Insurechain Arch](https://github.com/M-SETU/Insurechain/blob/phase-v1/Architecture.png "Insurechain Architecture")


1. Hybrid blockchain includes benefits of both the openness of a public blockchain and restriction of a private network by limiting the access to join a network
2. Private networks generate the record of transactions which are stored and verified on the public blockchain. These help in faster transaction speeds, privacy of the data.
3. Insurechain is a solution which allows the enterprise to maintain a layer of privacy, along with scalability of transactions. Not only this, enterprises can take advantage of existing public blockchain, ethereum in this case, for security and validation. 
4. This helps the enterprise get the scalability of transactions like private network by building on sidechain by Matic, validate transactions through a trust-minimized network by using public checkpointing validators and get benefit of Ethereum public chain’s security.



## Insurance portability using public Blockcahin
Ethereum, the world’s first fully-fledged smart-contract platform, provides exciting propositions. It is in fact Ethereum that is leading the innovation in the public blockchain domain and is being explored in a multitude of application areas.
Application on Ethereum are making huge progress but the current blockchain ecosystem is not prepared to scale as per the demand because of slow block confirmations and high gas fees.

Matic Network solves the above problems by building a decentralized platform using an adapted version of Plasma framework that provides a solution for faster and extremely low-cost transactions with finality on the main chain.

The following things happen on the public blockchain in the InsureChain Portal
1. Basic identifiable details of the customers
2. Basic identifiable details of the vendors
3. Metadata for NFTs\
  - Meta details of the policies.\
  - Details regarding the portability (When, from which vendor to which vendor the policies was ported)
4. Claims\
   - Hashes of the claims

## Customer Journeys: Customer onboarding, Claims & Porting of Health Insurance
The UserFlow Diagram can be studied here.
1. Vendor 1 & Vendor 2 have their own PPS commit chains which does
   - Customer onboarding
   - Claim Handling
   - Portability Handling
2. Consortium smart contract adding which does
   - Interoperability between the vendors
   - Policy Transfers
The UserFlow Diagram can be studied here.

![UserFlow Diagram](https://github.com/M-SETU/Insurechain/blob/phase-v1/User_flow.png "UserFlow Diagram")

## Conclusion

The Fourth Industrial Revolution will entirely depend on a few cutting edge technologies.
This revolution will introduce new challenges as well as exciting opportunities. Tackling these challenges and exploiting the opportunity will solely rely on the effective usage of these Public Blockchains. 

Realizing the potential of public Blockchains Insurechain a policy creation and porting platform has been created. 
This will not just increase ease the process of policy creation but will also leverage public blockchain to port insurance policies hasslefree.
