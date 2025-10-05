package main
import (
  "encoding/json"
  "fmt"
  "time"
  "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type WarehouseContract struct {
  contractapi.Contract
}

// Measurement represents item measurement data
type Measurement struct {
  ID             string    `json:"id"`
  Length         int       `json:"length"`
  Width          int       `json:"width"`
  Height         int       `json:"height"`
  Weight         int       `json:"weight"`
  OrganizationID string    `json:"organizationId"`
  Timestamp      time.Time `json:"timestamp"`
}

// TariffPolicy represents tariff policy data
type TariffPolicy struct {
  ID          string    `json:"id"`
  Name        string    `json:"name"`
  Description string    `json:"description"`
  Rate        float64   `json:"rate"`
  Unit        string    `json:"unit"` // "weight", "volume", "item"
  Category    string    `json:"category"`
  Active      bool      `json:"active"`
  CreatedBy   string    `json:"createdBy"`
  CreatedAt   time.Time `json:"createdAt"`
}

// Dispute represents dispute data
type Dispute struct {
  ID              string    `json:"id"`
  ItemID          string    `json:"itemId"`
  DisputeType     string    `json:"disputeType"` // "measurement", "tariff", "payment"
  Description     string    `json:"description"`
  Status          string    `json:"status"` // "open", "investigating", "resolved", "closed"
  RaisedBy        string    `json:"raisedBy"`
  AssignedTo      string    `json:"assignedTo"`
  Resolution      string    `json:"resolution"`
  CreatedAt       time.Time `json:"createdAt"`
  UpdatedAt       time.Time `json:"updatedAt"`
}

// RecordMeasurement records item measurements with organization context
func (c *WarehouseContract) RecordMeasurement(ctx contractapi.TransactionContextInterface, id string, length int, width int, height int, weight int, organizationId string) error {
  measurement := Measurement{
    ID:             id,
    Length:         length,
    Width:          width,
    Height:         height,
    Weight:         weight,
    OrganizationID: organizationId,
    Timestamp:      time.Now(),
  }

  measurementJSON, err := json.Marshal(measurement)
  if err != nil {
    return fmt.Errorf("failed to marshal measurement: %v", err)
  }

  return ctx.GetStub().PutState(id, measurementJSON)
}

// GetMeasurement retrieves item measurements
func (c *WarehouseContract) GetMeasurement(ctx contractapi.TransactionContextInterface, id string) (string, error) {
  measurementJSON, err := ctx.GetStub().GetState(id)
  if err != nil {
    return "", fmt.Errorf("failed to read from world state: %v", err)
  }
  if measurementJSON == nil {
    return "", fmt.Errorf("measurement %s does not exist", id)
  }

  return string(measurementJSON), nil
}

// CreateTariffPolicy creates a new tariff policy
func (c *WarehouseContract) CreateTariffPolicy(ctx contractapi.TransactionContextInterface, id string, name string, description string, rate float64, unit string, category string, createdBy string) error {
  exists, err := ctx.GetStub().GetState(id)
  if err != nil {
    return fmt.Errorf("failed to read from world state: %v", err)
  }
  if exists != nil {
    return fmt.Errorf("tariff policy %s already exists", id)
  }

  policy := TariffPolicy{
    ID:          id,
    Name:        name,
    Description: description,
    Rate:        rate,
    Unit:        unit,
    Category:    category,
    Active:      true,
    CreatedBy:   createdBy,
    CreatedAt:   time.Now(),
  }

  policyJSON, err := json.Marshal(policy)
  if err != nil {
    return fmt.Errorf("failed to marshal tariff policy: %v", err)
  }

  return ctx.GetStub().PutState(id, policyJSON)
}

// GetTariffPolicy retrieves a tariff policy
func (c *WarehouseContract) GetTariffPolicy(ctx contractapi.TransactionContextInterface, id string) (string, error) {
  policyJSON, err := ctx.GetStub().GetState(id)
  if err != nil {
    return "", fmt.Errorf("failed to read from world state: %v", err)
  }
  if policyJSON == nil {
    return "", fmt.Errorf("tariff policy %s does not exist", id)
  }

  return string(policyJSON), nil
}

// UpdateTariffPolicy updates an existing tariff policy
func (c *WarehouseContract) UpdateTariffPolicy(ctx contractapi.TransactionContextInterface, id string, name string, description string, rate float64, unit string, category string, active bool) error {
  policyJSON, err := ctx.GetStub().GetState(id)
  if err != nil {
    return fmt.Errorf("failed to read from world state: %v", err)
  }
  if policyJSON == nil {
    return fmt.Errorf("tariff policy %s does not exist", id)
  }

  var policy TariffPolicy
  err = json.Unmarshal(policyJSON, &policy)
  if err != nil {
    return fmt.Errorf("failed to unmarshal tariff policy: %v", err)
  }

  policy.Name = name
  policy.Description = description
  policy.Rate = rate
  policy.Unit = unit
  policy.Category = category
  policy.Active = active

  updatedPolicyJSON, err := json.Marshal(policy)
  if err != nil {
    return fmt.Errorf("failed to marshal updated tariff policy: %v", err)
  }

  return ctx.GetStub().PutState(id, updatedPolicyJSON)
}

// CalculateTariff calculates tariff for an item based on active policies
func (c *WarehouseContract) CalculateTariff(ctx contractapi.TransactionContextInterface, itemId string, organizationId string) (string, error) {
  // Get item measurement
  measurementJSON, err := ctx.GetStub().GetState(itemId)
  if err != nil {
    return "", fmt.Errorf("failed to read item measurement: %v", err)
  }
  if measurementJSON == nil {
    return "", fmt.Errorf("item %s does not exist", itemId)
  }

  var measurement Measurement
  err = json.Unmarshal(measurementJSON, &measurement)
  if err != nil {
    return "", fmt.Errorf("failed to unmarshal measurement: %v", err)
  }

  // Get all tariff policies for the organization (simplified - in real implementation would query by org)
  tariffIterator, err := ctx.GetStub().GetStateByRange("tariff_", "tariff_~")
  if err != nil {
    return "", fmt.Errorf("failed to get tariff policies: %v", err)
  }
  defer tariffIterator.Close()

  var totalTariff float64 = 0
  var appliedPolicies []TariffPolicy

  for tariffIterator.HasNext() {
    queryResponse, err := tariffIterator.Next()
    if err != nil {
      return "", fmt.Errorf("failed to get next tariff policy: %v", err)
    }

    var policy TariffPolicy
    err = json.Unmarshal(queryResponse.Value, &policy)
    if err != nil {
      continue // Skip invalid policies
    }

    if !policy.Active {
      continue
    }

    var charge float64
    switch policy.Unit {
    case "weight":
      charge = float64(measurement.Weight) * policy.Rate
    case "volume":
      volume := float64(measurement.Length * measurement.Width * measurement.Height)
      charge = volume * policy.Rate
    case "item":
      charge = policy.Rate
    default:
      continue
    }

    totalTariff += charge
    appliedPolicies = append(appliedPolicies, policy)
  }

  result := map[string]interface{}{
    "itemId":          itemId,
    "totalTariff":     totalTariff,
    "appliedPolicies": appliedPolicies,
    "calculatedAt":    time.Now(),
  }

  resultJSON, err := json.Marshal(result)
  if err != nil {
    return "", fmt.Errorf("failed to marshal tariff calculation: %v", err)
  }

  return string(resultJSON), nil
}

// CreateDispute creates a new dispute
func (c *WarehouseContract) CreateDispute(ctx contractapi.TransactionContextInterface, id string, itemId string, disputeType string, description string, raisedBy string) error {
  dispute := Dispute{
    ID:          id,
    ItemID:      itemId,
    DisputeType: disputeType,
    Description: description,
    Status:      "open",
    RaisedBy:    raisedBy,
    CreatedAt:   time.Now(),
    UpdatedAt:   time.Now(),
  }

  disputeJSON, err := json.Marshal(dispute)
  if err != nil {
    return fmt.Errorf("failed to marshal dispute: %v", err)
  }

  return ctx.GetStub().PutState("dispute_"+id, disputeJSON)
}

// GetDispute retrieves a dispute
func (c *WarehouseContract) GetDispute(ctx contractapi.TransactionContextInterface, id string) (string, error) {
  disputeJSON, err := ctx.GetStub().GetState("dispute_"+id)
  if err != nil {
    return "", fmt.Errorf("failed to read from world state: %v", err)
  }
  if disputeJSON == nil {
    return "", fmt.Errorf("dispute %s does not exist", id)
  }

  return string(disputeJSON), nil
}

// UpdateDisputeStatus updates dispute status and resolution
func (c *WarehouseContract) UpdateDisputeStatus(ctx contractapi.TransactionContextInterface, id string, status string, resolution string, assignedTo string) error {
  disputeJSON, err := ctx.GetStub().GetState("dispute_"+id)
  if err != nil {
    return fmt.Errorf("failed to read from world state: %v", err)
  }
  if disputeJSON == nil {
    return fmt.Errorf("dispute %s does not exist", id)
  }

  var dispute Dispute
  err = json.Unmarshal(disputeJSON, &dispute)
  if err != nil {
    return fmt.Errorf("failed to unmarshal dispute: %v", err)
  }

  dispute.Status = status
  dispute.Resolution = resolution
  dispute.AssignedTo = assignedTo
  dispute.UpdatedAt = time.Now()

  updatedDisputeJSON, err := json.Marshal(dispute)
  if err != nil {
    return fmt.Errorf("failed to marshal updated dispute: %v", err)
  }

  return ctx.GetStub().PutState("dispute_"+id, updatedDisputeJSON)
}

// GetAllDisputes retrieves all disputes with optional status filter
func (c *WarehouseContract) GetAllDisputes(ctx contractapi.TransactionContextInterface, status string) (string, error) {
  disputeIterator, err := ctx.GetStub().GetStateByRange("dispute_", "dispute_~")
  if err != nil {
    return "", fmt.Errorf("failed to get disputes: %v", err)
  }
  defer disputeIterator.Close()

  var disputes []Dispute

  for disputeIterator.HasNext() {
    queryResponse, err := disputeIterator.Next()
    if err != nil {
      return "", fmt.Errorf("failed to get next dispute: %v", err)
    }

    var dispute Dispute
    err = json.Unmarshal(queryResponse.Value, &dispute)
    if err != nil {
      continue // Skip invalid disputes
    }

    if status != "" && dispute.Status != status {
      continue
    }

    disputes = append(disputes, dispute)
  }

  disputesJSON, err := json.Marshal(disputes)
  if err != nil {
    return "", fmt.Errorf("failed to marshal disputes: %v", err)
  }

  return string(disputesJSON), nil
}

func main() {
  chaincode, err := contractapi.NewChaincode(new(WarehouseContract))
  if err != nil {
    panic(err.Error())
  }
  if err := chaincode.Start(); err != nil {
    panic(err.Error())
  }
}