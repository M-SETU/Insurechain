# Insurechain
Insurechain is a blockchain which enables seamless porting of the policies, allowing interoperability and interaction between various private chains run by insurance companies

# Problem Statement
There are two main problems which need to be solved:

1. Broken Process
The current process for porting insurance policies is time consuming, expensive and leads to errors in data and ultimately loss of coverage for the customer. When customers move from one insurer to another, the entire data footprint eg KYC docs, claims, medical docs etc. is created all over again. This means the process folowed to port the policy is the same as the process of creating a new policy. This leads to increased costs and lead time,costs and possible loss of cover for the customer in case all the claims data cannot be produced at the new insurer. 

2. No Trasnparency or Accountability
Even if two insurers are willing to co-operate with each other, there is no transparency in the process. This means that no SLA's can be enforced on porting the insurance and government bodies like IRDAI will also not have any visibility on the 

# Using Blockchain Technology
Using a blockhain to store the details of porting insurances in an encrypted format would make the process transparent. This way government bodies like IRDAI will be able to view the process and enforce SLA's on the insurance providers. The data will be visible only by the current insurer, new insurer, government body and the customer. This trustless way of operating will reduce costs related to due diligence and data management and also preserve privacy.  

# Using Public Ledger versus Private Ledger
We have decided to use public ledgers to do the porting as it leads to reduced costs and increased security. This also prevents any particular insurer or government body from having dispropotionate power or influence in this system. 
The concept can be deployed using a permissioned ledger as well, but this will lead to centralization of power, where the body running the private infrastructure will have the power to add/remove nodes and thereby control which transactions are valid and which ones are not. This will ultimately defeat the purpose of using blockchain technology as this system would not be trustless.  

However, the public ledger used to build this system should have high performance and low cost per transaction to make the system viable. For this purpose we have decided to use the Matic Network public ledger as it support 7200+ TPS at a Txn cost less than $0.00003. 

# Technology used in the POC
The POC is using a Goerli chain and 2 Matic chains to simulate the porting mechainsm between the insurance providers. 
< need diagram here >

# 
1. Hybrid blockchain includes benefits of both the openness of a public blockchain and restriction of a private network by limiting the access to join a network
2. Private networks generate the record of transactions which are stored and verified on the public blockchain. These help in faster transaction speeds, privacy of the data.
3. Insurechain is a solution which allows the enterprise to maintain a layer of privacy, along with scalability of transactions. Not only this, enterprises can take advantage of existing public blockchain, ethereum in this case, for security and validation. 
4. This helps the enterprise get the scalability of transactions like private network by building on sidechain by Matic, validate transactions through a trust-minimized network by using public checkpointing validators and get benefit of Ethereum public chain’s security.

## Architecture
The basic working architecture of the public Matic Network chain can be studied here. However, here we take a step further and provide flexibility to what can be built on Matic Network. Apart from the public sidechain, we can build an enterprise sidechain or optimistic rollup sidechain or any other sidechain that wants to interact with the existing public architecture of Matic Network and benefit from the security provided by a public chain such as ethereum.


![Insurechain PPS](https://github.com/M-SETU/Insurechain/blob/master/PPS.png "Insurechain Architecture")


WIP





