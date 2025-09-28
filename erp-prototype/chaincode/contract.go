package main
import (
  "fmt"
  "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type WarehouseContract struct {
  contractapi.Contract
}

func (c *WarehouseContract) RecordMeasurement(ctx contractapi.TransactionContextInterface, id string, length int, width int, height int, weight int) error {
  record := fmt.Sprintf("%d,%d,%d,%d", length,width,height,weight)
  return ctx.GetStub().PutState(id, []byte(record))
}

func main() {
  chaincode, err := contractapi.NewChaincode(new(WarehouseContract))
  if err != nil { panic(err.Error()) }
  if err := chaincode.Start(); err != nil { panic(err.Error()) }
}