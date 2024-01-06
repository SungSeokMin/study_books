# 🌊 TL;DR

### 디자인 원칙

- OCP(Open-Closed Principle): 클래스는 확장에는 열려 있어야 하지만 변경에는 닫혀 있어야 한다.

### 데코레이터 패턴

- 객체에 추가 요소를 동적으로 더할 수 있다.
- 데코레이터를 사용하면 서브클래스를 만들 때보다 훨씬 유연하게 기능을 확장할 수 있다.

### 데코레이터

- **데코레이터는 자신이 장식하고 있는 객체에게 어떤 행동을 위임하는 일 말고도 추가 작업을 수행할 수 있다.**
- 데코레이터의 슈퍼클래스는 자신이 장식하고 있는 객체의 슈퍼클래스와 같다.
- 한 객체를 여러 개의 데코레이터로 감싹 수 있다.
- 객체는 언제든지 감쌀 수 있으므로 실행 중에 필요한 데코레이터를 마음대로 적용할 수 있다.

# 🍭 시나리오

> 스타버즈 카페의 주문 시스템을 개선한다.

- Beverave는 음료를 나타내는 추상 클래스이며 매장에서 판매되는 모든 음료는 이 클래스의 서브클래스가 된다.
- cost() 메소드는 추상 메소드이며, 서브클래스에서 이 메소드를 구현해서 새로 정의해야 한다.

```java
public abstract class Beverage {
  String description = "Unknown Beverage";

  public String getDescription() {
    return description;
  }

  public abstract double cost();
}
```

> 고객이 커피를 주문할 때 샷 추가, 휘핑크림 등 추가할 수 있다.

- 각각을 추가할 때마다 커피 가격이 올라가야 하기에 주문 시스템을 구현할 때 아래와 같이 만들었다.

```java
class HouseBlendWithMilkandMocha extends Beverage {}
class HouseBlendWithMilkandMochaandCaramel extends Beverage {}
class HouseBlendWithMilkandMochaandCaramelandOneShot extends Beverage {}
...
```

> **❌문제 발생❌: 너무 많은 클래스들이 추가되었다.**

# 📌 데코레이터 패턴 (Decorator Pattern)

- 객체에 추가 요소를 동적으로 더할 수 있다.
- 데코레이터를 사용하면 서브클래스를 만들 때보다 훨씬 유연하게 기능을 확장할 수 있다.

### 데코레이터

- **데코레이터는 자신이 장식하고 있는 객체에게 어떤 행동을 위임하는 일 말고도 추가 작업을 수행할 수 있다.**
- 데코레이터의 슈퍼클래스는 자신이 장식하고 있는 객체의 슈퍼클래스와 같다.
- 한 객체를 여러 개의 데코레이터로 감싹 수 있다.
- 객체는 언제든지 감쌀 수 있으므로 실행 중에 필요한 데코레이터를 마음대로 적용할 수 있다.

## 주문 시스템에 데코레이터 패턴 적용하기

1. DarkRoast 객체를 주문한다.
   - Beverage로부터 상속받으므로 음료의 가격을 계산하는 cost() 메소드를 가지고 있다..
2. 고객이 모카를 주문했으니 Mocha 객체를 만들고 그 객체로 DarkRoast를 감싼다.
   - Mocha 객체는 데코레이터이다.
3. 고객이 휘핑크림도 추가했으니 Whip 데코레이터를 만들어 Mocha를 감싼다.
4. 가장 바깥쪽에 있는 데코레이터(Whip)의 cost()를 호출한다. Whip은 그 객체가 장식하고 있는 객체에게 가격 계산을 위임하게 되고 계산된 가격에 Whip의 가격을 더한 다음 그 결과값을 리턴한다.

![주문 시스템에 데코레이터 패턴 적용하기](https://github.com/SungSeokMin/book_design-patterns/assets/72539723/486544b2-dfcf-4a39-abb4-fe18c1b2ad8c)

## 커피 주문 시스템 코드 만들기

### 음료 클래스 구현

```java
public abstract class Beverage {
  String description = "설명 없음";

  public String getDescription() {
    return description;
  }

  public abstract double cost();
}
```

### 첨가물 추상 클래스 구현

```java
public abstract class CondimentDecorator extends Beverage {
  Beverage beverage;

  public abstract String getDescription();
}
```

### 음료 코드 구현

```java
public class Espresso extends Beverage {

  public Espresso() {
    description = "Espresso";
  }

  public double cost() {
    return 1.99;
  }
}

public class HouseBlend extends Beverage {
  public HouseBlend() {
    description = "House Blend Coffee";
  }

  public double cost() {
    return .89;
  }
}
```

### 첨가물 코드 구현

```java
public class Mocha extends CondimentDecorator {
  public Mocha(Beverage beverage) {
    this.beverage = beverage;
  }

  public String getDescription() {
    return beverage.getDescription() + ", 모카";
  }

  public double cost() {
    return .20 + beverage.cost();
  }
}
```
