# 🌊 TL;DR

### 디자인 원칙

- 애플리케이션에서 달라지는 부분을 찾아내고, 달라지지 않는 부분과 분리한다.
- 구현보다는 인터페이스에 맞춰서 프로그래밍한다.
- 상속보다는 구성을 활용한다.

### 전략 패턴 (Strategy Pattern)

- 객체들이 할 수 있는 행위 각각에 대해 전략 클래스를 생성하고, 유사한 행위들을 캡슐화 하는 인터페이스를 정의한다.
- 객체의 행위를 동적으로 바꾸고 싶은 경우 직접 행위를 수정하지 않고 전략을 바꿔주기만 함으로써 유연하게 확장하는 방법을 말한다.

# 🍭 시나리오

> **오리 시뮬레이션 게임을 만드는 회사에 다니고 있다.**

Joe는 Duck 이라는 슈퍼클래스를 만든 다음, 그 클래스를 확장해서 서로다른 종류의 오리를 만들었다.

```java
class Duck {
  quack() // 모든 오리가 꽥꽥 소리를 낼 수 있다.
  swim() // 모든 오리가 헤엄을 칠 수 있다.
  display() // 각각 다른 오리의 모습을 화면에 보여준다.
}

class MallardDuck extends Duck {
  display() { /* 적당한 모양을 표시 */};
}

class RedheadDuck extends Duck {
  display() { /* 적당한 모양을 표시 */};
}
```

> **오리가 날 수 있어야 한다는 결정을 내렸다.**

Joe는 Duck 슈퍼클래스에 fly() 메소드를 추가하고 모든 오리가 상속받을 수 있을 거라고 생각한다.

```java
class Duck {
  quack(); // 모든 오리가 꽥꽥 소리를 낼 수 있다.
  swim(); // 모든 오리가 헤엄을 칠 수 있다.
  display(); // 각각 다른 오리의 모습을 화면에 보여준다.
  fly(); // 모든 오리는 날 수 있다.
}
```

> **❌문제 발생❌: 날아다니면 안되는 고무 오리들이 날아다니기 시작했다.**

Duck의 몇몇 서브클래스만 날아야 한다는 사실을 깜빡했다.  
Joe는 코드를 재사용한다는 점에서 상속을 기가 막히게 활용했다고 생각했지만 유지보수를 생각하면 안 좋아 보인다는 걸 깨닳았다.

> **상속을 생각하며 오버라이드 하기**

Joe는 메소드를 아무것도 하지 않도록 오버라이드 하는 방법을 생각했다.

```java
class RubberDuck extends Duck {
  quack() {/* 삑삑 소리 */};
  display() { /* 고무 오리 */};
  fly() { /* 아무것도 하지 않도록 오버라이드 */};
}

class RubberDuck extends Duck {
  quack() {/* 아무것도 하지 않도록 오버라이드 */};
  display() { /* 가짜 오리 */};
  fly() { /* 아무것도 하지 않도록 오버라이드 */};
}
```

> **인터페이스 설계하기**

Joe는 규격이 계속 바뀔 거라는 사실을 알고 특정 메소드를 일일이 살펴보고 오버라이드 하는건 바보 같다고 생각했다.  
Flyable, Quackable 인터페이스를 구현하자.

```java
interface Flayble {
  public void fly();
}

interface Quackable {
  public void quack();
}

class MallardDuck extends Duck implements Flyable, Quackable {
  @Override
  void fly() { /* 날 수 있다. */ };

  @Override
  void quack() { /* 꽥꽥 소리 */ };
}

class RubberDuck extends Duck implements Quackable {
  @Override
  void fly() { /* 날 수 없다. */ };

  @Override
  void quack() {/* 삑삑 소리 */};
}
```

> 모든 서브 클래스에서 날거나 꽥꽥거리는 기능이 있어야 하는 것은 아니므로 상속이 올바른 방법은 아니다.  
> Flayable, Quackable을 구현해서 일부 분제점을 해결할 수 있지만  
> 코드를 재샤용하지 않으므로 코드 관리에 큰 문제가 생긴다.

# 📌 전략 패턴 (Strategy Pattern)

- 객체들이 할 수 있는 행위 각각에 대해 전략 클래스를 생성하고, 유사한 행위들을 캡슐화 하는 인터페이스를 정의한다.
- 객체의 행위를 동적으로 바꾸고 싶은 경우 직접 행위를 수정하지 않고 전략을 바꿔주기만 함으로써 유연하게 확장하는 방법을 말한다.

## 문제를 명확하게 파악하기

- 서브클래스마다 오리의 행동이 바뀔 수 있는데도 모든 서브클래스에서 한 가지 행동만 사용하도록 하는 것은 올바르지 못하므로 **상속은 성공적인 해결책이 아니었다.**
- Flyable, Quackable 인터페이스를 사용하는 방법은 괜찮아 보였지만, 재사용할 수 없다는 큰 문제가 있었다.

📍 애플리케이션에서 달라지는 부분을 찾아내고, 달라지지 않는 부분과 분리한다. 즉, **바뀌는 부분은 따로 뽑아서 캡슐화한다.**

## 바뀌는 부분과 그렇지 않은 부분 분리하기

**변화하는 부분과 그대로 있는 부분**을 분리하려면 2개의 클래스 집합(set)을 만들어야 한다.  
▶︎ 각 클래스 집합에는 각각의 행동을 구현한 것을 전부 집어넣는다.

- 나는 것과 관련된 부분(fly)
  - 날 수 있는 행동 구현
  - 날지 못 하는 행동 구현
- 꽥꽥거리는 것과 관련된 부분(quack)
  - 꽥꽥거리는 행동 구현
  - 삑삑거리는 행동 구현
  - 아무 소리도 내지 않는 행동 구현

## 행동을 디자인하는 방법

**구현보다는 인터페이스에 맞춰서 프로그래밍한다.** ↔️ **상위 형식에 맞춰서 프로그래밍한다.**

변수를 선언할 때 보통 추상 클래스나 인터페이스 같은 상위 형식으로 선언해야한다.

- 객체를 변수에 대입할 때 상위 형식을 구체적으로 구현한 형식이라면 어떤 객체든 넣을 수 있기 때문이다.
- 그러면 변수를 선언하는 클래스에서 실제 객체의 형식을 몰라도 된다.

```java
// 다형적인 형식을 사용하는 간단한 예시
interface Animal {
  public void makeSound();
}

class Dog implements Animal {
  makeSound() {
    bark();
  };

  bark() { /* 강아지 소리 */ };
}

class Cat implements Animal {
  makeSound() {
    meow();
  };

  meow() { /* 고양이 소리 */ };
}

// 구현에 맞춰서 코딩한 예
Dog d = new Dog();
d.dark();

// 인터페이스 & 상위 형식에 맞춰서 코딩한 예
Animal animal = new Dog();
animal.makeSound();
```

## 행동을 구현하는 방법

- 날 수 있는 클래스는 FlyBehavior 인터페이스를 구현해야 한다.

```java
interface FlyBehavior {
  public void fly();
}

class FlyWithWings implements FlyBehavior {
  fly() { /* 나는 방법을 구현 */ };
}

class FlyNoWay implements FlyBehavior {
  fly() { /* 아무것도 하지 않고, 날 수 없음 */ };
}
```

- 소리를 낼 수 있는 클래스는 QuackBehavior 인터페이스를 구현해야 한다.

```java
interface QuackBehavior {
  void quack();
}

class Quack implements QuackBehavior {
  quack() {
    /* 꽥꽥 소리 */
  };
}

class Squeak implements QuackBehavior {
  quack() {
    /* 삑삑 소리 */
  };
}

class MuteQuack implements QuackBehavior {
  quack() {
    /* 아무 소리 없음 */
  };
}
```

**이런 식으로 디자인하면 다른 형식의 객체에서도 나는 행동과 꽥꽥거리는 행동을 재사용할 수 있다.**

## 두 클래스를 합치는 방법

두 클래스를 합치는 것을 '**구성(composition)을 이용한다**'라고 표현한다.  
구성은 매우 중요한 테크닉이자 세 번째 디자인 원칙이기도 하다.
