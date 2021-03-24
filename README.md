# M-Setu
M-Setu is a hybrid blockchain that enables seamless porting of the policies between different vendors, allowing interoperability and interaction between public and private Blockchain.

## Idea behind Insurechain
The idea of M-Setu came from building a bridge between public and private blockchain within the Ethereum ecosystem.
This is an outcome of multiple discussions between Infosys Consulting and Polygon on the basis of domain expertise of Infosys Consulting in insurance sector and Polygon's expertise in the area of blockchain. 

1. Public-Private Blockchain includes benefits of both the openness of a public blockchain and confidentiality of a private network by limiting the access to join a network
2. Private networks generate the record of transactions that are stored and verified on the public Blockchain. These help in faster transaction speeds.
3. M-Setu is a solution that allows any company to maintain a layer of privacy along with public verifiability of the transactions. 
4. This helps the enterprise get the scalability of transactions like private Blockchain by building on a sidechain by Polygon and validating transactions through a trust-minimized network using public checkpointing validators that finally commit it on Ethereum main chain to provide verifiable public proof.

# Problem Statement
In our experience working with multiple insurance companies, there are two main pain points that need to be solved:

1. Broken Process

The current process for porting insurance policies is time-consuming, expensive, and leads to data errors and ultimately loss of coverage for the customer. When customers move from one insurer to another, the entire data footprint, e.g., KYC docs, claims, medical docs, Etc., is created all over again. That means the process followed to port the policy is the same as creating a new policy. Therefore, it leads to increased costs and lead time, costs, and possible loss of cover for the customer if all the claims data cannot be produced at the new insurer. 

2. No Transparency or Accountability

Even if two insurers are willing to cooperate, there is no transparency in the process. No service level agreements (SLA) are enforced on porting the insurance, and government bodies like IRDAI will not have any visibility on the portal.

## Design Considerations
In the following section, let us cover the salient points of the technical solution and the architecture.
We will also cover the rationale of choosing a given functionality on the basis of domain expertise of Infosys Consulting in insurance sector.

## Public Blockchain Architecture
In this section, we provide a proof-of-concept(POC) on how we address these business challenges using Polygon Network. Apart from the public Proof-of-Stake (PoS) chain, we can build an enterprise sidechain or optimistic rollup or any other sidechain that wants to interact with the existing public architecture of Polygon Network and benefit from the security provided by a public chain such as Ethereum.

### How Does it Work
1. A user does a normal transaction off-chain to an aggregator (block producer)
2. The transaction goes to the aggregator 
3. The aggregator bonds multiple user-transactions into a sidechain
4. The aggregator computes a new state root and creates an ethereum mainchain transaction, and publishes it

The significant advantage is that it batches transactions on-chain and reduces the cost of user transactions. In this approach, the data can remain confidential if required. However, the transaction data required for calling transactions is required. 

![M-Setu PPS](https://github.com/M-SETU/Insurechain/blob/master/PPS.png "Matic Architecture")

# Rationale for choosing Public Ledger over Private Ledger
We decided to choose a public ledger for the insurance porting to reduce costs and increase security. This architecture prevents any particular insurer or government body from having disproportionate power or influence in this system. 
The Proof of concept (PoC) can be deployed using a permissioned ledger, but this will lead to centralization of power, where the body running the private infrastructure will have the power to add/remove nodes and thereby control which transactions are valid ones and which are not. That will ultimately defeat the purpose of using blockchain technology as this system would not be trust-minimized.

In order to have high performance and low cost per transaction to make the system commerically viable, we decided to use the Polygon Network's public ledger (PoS chain) as it can support upto 7200+ transaction per sec (tps) at a transaction cost of less than $0.00003 per transaction. 

# High-level Technical Architecture and its advantages

![M-Setu Arch](https://github.com/M-SETU/Insurechain/blob/master/Architecture.png "M-Setu Architecture")

1. Public-Private Blockchain includes benefits of both the openness of a public blockchain and confidentiality of a private network by limiting the access to join a network
2. Private networks generate the record of transactions that are stored and verified on the public Blockchain. These help in faster transaction speeds, the privacy of the data.
3. M-Setu is a solution that allows any enterprise to maintain a layer of privacy along with public verifiability of the transactions. 

## Insurance portability using public Blockchain
We have modelled an insurance policy as Non-fungible token (NFT) as per the ERC-721 specification. We capture the following data objects for this PoC.

1. Basic identifiable details of the customers
2. Basic identifiable details of the vendors
3. Metadata for NFTs\
  - Meta details of the policies.\
  - Details regarding the portability (When? from which vendor? to which vendor the policies were ported)
4. Claims\
   - Hashes of the claims

## Customer Journeys: Customer onboarding, Claims & Porting of Health Insurance
The user flow Diagram can be studied here.
1. Vendor 1 & Vendor 2 have their PPS commit chains which do
   - Customer onboarding
   - Claim Handling
   - Portability Handling
2. Consortium smart contract adding, which does
   - Interoperability between the vendors
   - Policy Transfers
The user flow Diagram can be studied here.

![UserFlow Diagram](https://github.com/M-SETU/Insurechain/blob/master/User_flow.png "UserFlow Diagram")

## Video Demo

[![Insurechain Video demo](Video.png)](https://drive.google.com/file/d/140nkdJTaBX_qfekZsVtRshdBNxEdVfSd/view)

## Future Enhancements

As per the roadmap of Polygon, an Software Development Kit (SDK) will enable Stand Alone and Secured Chains. In the future we can add the new functionality such as zk-rollups, optimistic rollups, Arbitrum roll ups etc. to expose non-sensitive information on the chain to the public/external world. This will allow insurance companies to have third-party application developers build richer functionality on the top of the existing m-Setu platform. Please refer to [Polygon lightpaper](https://polygon.technology/lightpaper-polygon.pdf) for more details on the upcoming technologies.

## Conclusion

The PoC is the synergy between the domain expertise of Infosys Consulting in the insurance sector and Polygon's path-breaking blockchain technology. Future enhancement to this PoC can be considered on the basis of business requirements. 


